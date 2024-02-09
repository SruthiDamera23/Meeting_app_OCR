from django.db import models

# Create your models here.
class Person(models.Model):

    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=50)

    email = models.EmailField(max_length=80)
    # Indicates if the person has been deleted.
    deleted = models.BooleanField(default=False)

