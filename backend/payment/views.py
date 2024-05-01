import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from church.models import Church
from payment.models import Payment
from stripe import Price
import stripe
from datetime import datetime
import pytz


# Set your Stripe API key
stripe.api_key = "sk_test_51P6bIrEt10Rr6G1LhHWNXcgXnFQBqZ6qHRwmbpSNA7ulggueRpGxLaoEWphYcrOrZImptljEhcCpPjCPoe7OX2lg00HOY33fjq"

@csrf_exempt
def charge_card(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            payment_method_id = data.get('payment_method')
            amount = data.get('amount')
            church_id = data.get('church_id')
            email = data.get('email')
            if not all([payment_method_id, amount, church_id, email]):
                return JsonResponse({'error': 'Missing required fields'}, status=400)

            # Retrieve or create customer on Stripe
            try:
                customer = stripe.Customer.retrieve(church_id)
            except stripe.error.InvalidRequestError:
                customer = stripe.Customer.create(
                    payment_method=payment_method_id,
                    email=email,
                    invoice_settings={'default_payment_method': payment_method_id}, 
                )

            # Charge the customer
            stripe.PaymentIntent.create(
                customer=customer.id,
                payment_method=payment_method_id,
                amount=amount*100,
                currency='usd',
                confirm=True,
                off_session=True,
            )

            # Create a Payment object in your database
            Payment.objects.create(
                payment_id=payment_method_id,
                amount=amount,
                email=email,
                date=datetime.now(pytz.utc),
                success=True
            )

            return JsonResponse({'message': 'Payment successful','payment_id':payment_method_id}, status=200)
        except stripe.error.CardError as e:
            Payment.objects.create(
                payment_id=payment_method_id,
                amount=amount,
                email=email,
                date=datetime.now(pytz.utc),
                success=False
            )
            return JsonResponse({'error': e.user_message}, status=400)
        except stripe.error.StripeError as e:
            Payment.objects.create(
                payment_id=payment_method_id,
                amount=amount,
                email=email,
                date=datetime.now(pytz.utc),
                success=False
            )
            return JsonResponse({'error': 'Stripe error occurred'}, status=500)
        except Exception:
            return JsonResponse({'error': 'An unexpected error occurred'}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    

def fetch_card_details(payment_id):
    try:
      
        payment_method = stripe.PaymentMethod.retrieve(payment_id)
        if payment_method.card:
            card_details = {
                "brand": payment_method.card.brand,
                "last4": payment_method.card.last4,
                "exp_month": payment_method.card.exp_month,
                "exp_year": payment_method.card.exp_year
            }
            return card_details
        else:
            return None
    except stripe.error.StripeError as e:
        print(str(e))
        return None


def get_all_payments(request):
    try:
        payments = Payment.objects.all()
        payment_list = []
        for payment in payments:
            payment_details = {
                'payment_id': payment.payment_id,
                'church_id': payment.church.id,
                'church_name': payment.church.name,
                'email': payment.email,
                'date': payment.date,
                'amount': payment.amount,
                'is_success': payment.success,
            }
            card_details = fetch_card_details(payment.payment_id)
            if card_details:
                payment_details.update(card_details)
            payment_list.append(payment_details)
        return JsonResponse({'payments': payment_list}, status=200)
    except Exception as e:
        print(str(e))
        return JsonResponse({'error': str(e)}, status=500)