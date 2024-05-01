from datetime import datetime
import threading
import time
from django.apps import AppConfig
import logging


logger = logging.getLogger(__name__)

class PaymentScheduler(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'payment'

    def ready(self):
        from payment.views import Payment, repeat_payment_in_stripe
        from church.models import Church
        def subscription_payment_automation():
            while True:
                churches = Church.objects.filter(deleted=False)
                for church in churches:
                    days_since_creation = (datetime.now().date() - church.date_created.date()).days
                    if days_since_creation>28 and days_since_creation % 28 == 0:
                        most_recent_payment = Payment.objects.filter(church=church).order_by('-date').first()
                        if most_recent_payment:
                            payment_id = most_recent_payment.payment_id
                            repeat_payment_in_stripe(payment_id, most_recent_payment.email, church.subscription.price * 100, church)
                        else:
                            logger.warning("No recent payment found for church: %s", church.id)
                time.sleep(86400) # to run schedule every 10 days 

        thread = threading.Thread(target=subscription_payment_automation)
        thread.daemon = True
        thread.start()
