from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse

class CustomAccountAdapter(DefaultAccountAdapter):
    def send_confirmation_mail(self, request, emailconfirmation, signup):
        # Override to send the confirmation link to the frontend
        activate_url = self.get_email_confirmation_url(request, emailconfirmation)
        ctx = {
            "user": emailconfirmation.email_address.user,
            "activate_url": activate_url,
            "current_site": get_current_site(request),
            "key": emailconfirmation.key,
        }
        self.send_mail("account/email/email_confirmation", emailconfirmation.email_address.email, ctx)
    
    def get_email_confirmation_url(self, request, emailconfirmation):
        """Constructs the email confirmation (activation) url.
        Note that if you have architected your system such that email
        confirmations are sent outside of the request context `request`
        can be `None` here.
        """
        url = f"{settings.FRONTEND_URL}/verify-email?key={emailconfirmation.key}"
        return url
