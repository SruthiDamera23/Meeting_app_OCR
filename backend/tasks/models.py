from django.db import models
from meeting.models import Meeting

class Task(models.Model):
    task_id = models.AutoField(primary_key=True)
    task_name = models.CharField(max_length=255)
    employee_name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    is_delete = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    priority = models.CharField(max_length=255)
    task_description = models.CharField(max_length=500)
    meeting_id = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='tasks')
    meetings = models.ManyToManyField('meeting.Meeting', blank=True)

