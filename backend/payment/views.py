import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import stripe

# Set your Stripe API key
stripe.api_key = "sk_test_51P6bIrEt10Rr6G1LhHWNXcgXnFQBqZ6qHRwmbpSNA7ulggueRpGxLaoEWphYcrOrZImptljEhcCpPjCPoe7OX2lg00HOY33fjq"

@csrf_exempt
def charge_card(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        payment_method_id = data.get('payment_method')
        amount = data.get('amount')

        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=amount*100,
                currency='usd',
                payment_method=payment_method_id,
                confirmation_method='manual',
                confirm=True,
                return_url='http://lcoalhost:3000/'
            )
            return JsonResponse({'message': 'Payment successful'}, status=200)
        except stripe.error.CardError as e:
            return JsonResponse({'error': e.user_message}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
