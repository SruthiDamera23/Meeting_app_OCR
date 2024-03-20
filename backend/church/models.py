from django.db import models

class Church(models.Model):
    name = models.CharField(max_length=50)
    # Indicates if the Church has been deleted.
    deleted = models.BooleanField(default=False)