from .models import Meeting
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import MeetingSerializer
from django.core.mail import send_mail
from django.template.loader import render_to_string

@api_view(['GET', 'POST'])
def schedule(request):
    if request.method == 'GET':
        queryset = Meeting.objects.all()
        serialized_queryset = [MeetingSerializer(member).data for member in queryset if not member.deleted]
        return Response(serialized_queryset, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = MeetingSerializer(data=request.data)
        if serializer.is_valid():
            meeting = serializer.save()
            send_notifications(meeting)
            return Response({'message': 'Meeting created.'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def edit_meeting(request, pk):
    meeting = Meeting.objects.get(id=pk)
    serializer = MeetingSerializer(meeting, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Meeting edited.'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def ocr(request):
    # Currently just returning text
    data_dict = request.data['image_binary']
    int_list = []
    for i in range(len(data_dict)):
        int_list.append(int(data_dict[str(i)]))
    # gv_api_response = _handwriting_to_text(bytes(int_list))
    response_dict = _handwriting_to_text(bytes(int_list))
    # return Response({'text': gv_api_response.full_text_annotation.text}, status=status.HTTP_200_OK)
    return Response(response_dict, status=status.HTTP_200_OK)

def _handwriting_to_text(image_data):
    """
    Pulled/adapted from Google Vision docs.
    Detect handwriting in image and return
    OCR details, including text transcription.
    """

    # This import is in function scope moreso for development/human reasons than
    # for production/execution reasons. While some interesting discussion is
    # available on the pros/cons of function scope imports, the author's chief
    # concerns are 1) avoiding annoying errors if other developers choose not to
    # install this package, and 2) making it virtually impossible to forget to
    # remove the import if a future developer changes the OCR API.
    from google.cloud import vision
    from google.cloud.vision_v1.types.image_annotator import EntityAnnotation

    client = vision.ImageAnnotatorClient()

    image = vision.Image(content=image_data)

    response = client.document_text_detection(image=image)
    ta = response.text_annotations
    # Write full OCR response text to terminal.
    print(response.full_text_annotation.text)

    bounding_vertices = EntityAnnotation.to_dict(ta[0])['bounding_poly']['vertices']

    # Vertices in list ordered clockwise from upper left - assume rectangular bounds.
    v0 = bounding_vertices[0]
    v1 = bounding_vertices[1]
    # v2 = bounding_vertices[2]
    # v3 = bounding_vertices[3]

    # Second column begins just right of center.
    x_col_divider = (v0['x'] + v1['x']) * 9 // 20

    # Left column of meeting book page
    name_date_y_start = None
    agenda_y_start = None
    people_y_start = None
    questions_y_start = None

    # Right column of meeting book page
    objective_y_start = None
    notes_y_start = None
    action_steps_y_start = None

    # Use words on meeting book page as markers.
    for i in range(1, len(ta)):
        word_dict = EntityAnnotation.to_dict(ta[i])
        description = word_dict['description']
        y = word_dict['bounding_poly']['vertices'][0]['y']
        if name_date_y_start == None and 'Name' in description:
            name_date_y_start = y
        elif agenda_y_start == None and 'Agenda' in description:
            agenda_y_start = y
        elif people_y_start == None and 'People' in description:
            people_y_start = y
        elif questions_y_start == None and 'Questions' in description:
            questions_y_start = y
        elif objective_y_start == None and 'Objective' in description:
            objective_y_start = y
        elif notes_y_start == None and 'Notes' in description:
            notes_y_start = y
        elif action_steps_y_start == None and 'Action' in description:
            action_steps_y_start = y

    name_date = ''
    agenda = ''
    people = ''
    questions = ''
    objective = ''
    notes = ''
    action_steps = ''

    for i in range(1, len(ta)):
        word_dict = EntityAnnotation.to_dict(ta[i])
        description = word_dict['description']
        x = word_dict['bounding_poly']['vertices'][0]['x']
        y = word_dict['bounding_poly']['vertices'][0]['y']

        # Eliminate additional printed text.
        invited = 'Invited' in description
        productive = 'Productive' in description
        pastor = 'Pastor' in description
        steps = 'Steps' in description
        date = 'Date' in description and x > x_col_divider
        if invited or productive or pastor or steps or date:
            continue

        if y < agenda_y_start and y > name_date_y_start and x < x_col_divider:
            name_date += description + ' '
        elif y < people_y_start and y > agenda_y_start and x < x_col_divider:
            agenda += description + ' '
        elif y < questions_y_start and y > people_y_start and x < x_col_divider:
            people += description + ' '
        elif y > questions_y_start and x < x_col_divider:
            questions += description + ' '
        elif y < notes_y_start and y > objective_y_start and x >= x_col_divider:
            objective += description + ' '
        elif y < action_steps_y_start and y > notes_y_start and x >= x_col_divider:
            notes += description + ' '
        elif y > action_steps_y_start and x >= x_col_divider:
            action_steps += description + ' '

    # Strip out troublesome final character.
    name_date = name_date[:-1]
    agenda = agenda[:-1]
    people = people[:-1]
    questions = questions[:-1]
    objective = objective[:-1]
    notes = notes[:-1]
    action_steps = action_steps[:-1]

    # Write to terminal for debugging.
    print(name_date)
    print(agenda)
    print(people)
    print(questions)
    print(objective)
    print(notes)
    print(action_steps)

    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )

    response_dict = {
        'name_date': name_date,
        'agenda': agenda,
        'people': people,
        'questions': questions,
        'objective': objective,
        'notes': notes,
        'action_steps': action_steps
    }

    return response_dict


"""
Send notifications to emails of people
invited to meeting.
"""
def send_notifications(meeting):
    # Your existing code to create a meeting...

    # After saving the meeting, retrieve the selected attendees
    selected_attendees = meeting.attendees.all()

    # Prepare the email content
    subject = 'Meeting Invitation: ' + meeting.name
    #message = render_to_string('meeting_invitation.html', {'meeting': meeting})
    message = "Email automation working"

    # Get a list of email addresses of attendees
    attendee_emails = [attendee.email for attendee in selected_attendees]

    # Send emails to the attendees
    try:
        print("might be working")
        # Vivek's email hardcoded for debugging.
        send_mail(subject, message, 'krbvivek2000@gmail.com', attendee_emails)
    except Exception as e:
        print("An error occurred:", e)
