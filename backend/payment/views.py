import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from church.models import Church
from payment.models import Payment
from stripe import Price
import stripe

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
            subscription_id = data.get('subscription_id')
            email = data.get('email')
            if not all([payment_method_id, amount, church_id, subscription_id]):
                print("bp1")
                return JsonResponse({'error': 'Missing required fields'}, status=400)


            try:
                customer = stripe.Customer.retrieve(church_id)
            except stripe.error.InvalidRequestError as e:
                customer = stripe.Customer.create(
                    payment_method=payment_method_id,
                    email=email,
                    invoice_settings={'default_payment_method': payment_method_id}, 
                )
            product_data = {
                'name': 'Church Subscription',
                'type': 'service',
            }

            monthly_price = stripe.Price.create(
                unit_amount=amount,
                currency='usd',
                recurring={'interval': 'month'},
                product_data=product_data,
            )

            subscription = stripe.Subscription.create(
                customer=customer.id,
                items=[{'price': monthly_price.id}],
                expand=['latest_invoice.payment_intent']
            )

            return JsonResponse({'message': 'Payment and subscription created successfully', 'subscription_id': subscription.id}, status=200)
        except stripe.error.CardError as e:
            print(str(e))
            return JsonResponse({'error': e.user_message}, status=400)
        except stripe.error.InvalidRequestError as e:
            print(str(e))
            return JsonResponse({'error': 'Invalid request to Stripe'}, status=400)
        except stripe.error.StripeError as e:
            print(str(e))
            return JsonResponse({'error': 'Stripe error occurred'}, status=500)
        except Exception as e:
            print(str(e))
            return JsonResponse({'error': 'An unexpected error occurred'}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
def cancel_stripe_subscription(subscription_id):
    try:
        subscription = stripe.Subscription.retrieve(subscription_id)
        subscription.delete()
        return True, "Subscription canceled successfully."
    except stripe.error.InvalidRequestError as e:
        error_message = e.error.message
        return False, error_message