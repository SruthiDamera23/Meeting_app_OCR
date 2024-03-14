from django.db import models

# Represents a meeting entity for the 'meeting' app.
class Meeting(models.Model):
    # The primary key for the meeting.
    id = models.AutoField(primary_key=True)
    # The name of the meeting.
    name = models.CharField(max_length=255)
    # The type or category of the meeting.
    type = models.CharField(max_length=255)
    # The date of the meeting.
    date = models.DateField()
    # The time of the meeting.
    time = models.TimeField()
    # A field to store the list of attendees.
    attendees = models.ManyToManyField('person.Person', blank=True)
    # Agenda for meeting.
    agenda = models.TextField(default='')
    # Additional notes or details about the meeting.
    notes = models.TextField(default='')
    # Tasks associated with this meeting.
    meeting_tasks = models.ManyToManyField('tasks.Task', blank=True)
    # Indicates if the meeting has been deleted.
    deleted = models.BooleanField(default=False)
