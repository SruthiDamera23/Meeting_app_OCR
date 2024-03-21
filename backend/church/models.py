from django.db import models

class Church(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    # Indicates if the Church has been deleted.
    deleted = models.BooleanField(default=False)