from django.db import models
from church.models import Church

class Payment(models.Model):
    payment_id = models.CharField(max_length=100)
    church = models.ForeignKey(Church, on_delete=models.CASCADE)