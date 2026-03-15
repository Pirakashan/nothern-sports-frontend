import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export function Contact() {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Message sent! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#1a5632] mb-4">{t('nav.contact')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('contactPage.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1a5632]">{t('contactPage.sendMessage')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">{t('contactPage.yourName')}</Label>
                      <Input id="contact-name" required placeholder={t('contactPage.namePlaceholder')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">{t('contactPage.emailLabel')}</Label>
                      <Input id="contact-email" type="email" required placeholder={t('contactPage.emailPlaceholder')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">{t('contactPage.phoneLabel')}</Label>
                    <Input id="contact-phone" type="tel" placeholder={t('contactPage.phonePlaceholder')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-subject">{t('contactPage.subjectLabel')}</Label>
                    <Input id="contact-subject" required placeholder={t('contactPage.subjectPlaceholder')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">{t('contactPage.messageLabel')}</Label>
                    <Textarea
                      id="contact-message"
                      required
                      placeholder={t('contactPage.messagePlaceholder')}
                      className="min-h-32"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#ff6b35] hover:bg-[#e63946] text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1a5632]">{t('contactPage.contactInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-[#1a5632]">{t('facility.address')}</p>
                    <p className="text-gray-600 text-sm">{t('contact.address')}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-[#1a5632]">{t('facility.phone')}</p>
                    <p className="text-gray-600 text-sm">{t('contact.phone')}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-[#1a5632]">{t('facility.email')}</p>
                    <p className="text-gray-600 text-sm">{t('contact.email')}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-[#1a5632]">{t('facility.hours')}</p>
                    <p className="text-gray-600 text-sm">{t('contact.hours')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a5632] to-[#2a7048] text-white">
              <CardHeader>
                <CardTitle>{t('contactPage.needHelp')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-green-100">
                  {t('contactPage.helpDesc')}
                </p>
                <p className="font-bold text-lg">{t('contact.phone')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#1a5632]">{t('contactPage.getDirections')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  {t('contactPage.directionsDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
