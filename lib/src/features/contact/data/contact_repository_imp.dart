import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mailto/mailto.dart';
import 'package:portfolio/src/core/constants/business_information.dart';
import 'package:portfolio/src/features/contact/domain/contact_message.dart';
import 'package:portfolio/src/features/contact/domain/contact_repository.dart';
import 'package:portfolio/src/features/social_launcher/domain/url_launcher_repository.dart';
import 'package:whatsapp_unilink/whatsapp_unilink.dart';

class ContactRepositoryImp implements ContactRepository {
  const ContactRepositoryImp(this.ref);
  final Ref ref;

  @override
  Future<void> sendContactMessage(ContactMessage contactMessage) async {
    return switch (contactMessage.sendThrough) {
      SendThrough.whatsapp => _sendWhatsApp(contactMessage),
      SendThrough.email => _sendEmail(contactMessage)
    };
  }

  Future<void> _sendWhatsApp(ContactMessage contactMessage) async {
    final link = WhatsAppUnilink(
      phoneNumber: BusinessInformation.phone,
      text: contactMessage.formattedMessage,
    );
    await ref.read(urlLauncherRepositoryProvider).launchLink('$link');
  }

  Future<void> _sendEmail(ContactMessage contactMessage) async {
    final link = Mailto(
      to: [BusinessInformation.email],
      cc: [],
      body: contactMessage.formattedMessage,
    );
    await ref.read(urlLauncherRepositoryProvider).launchLink('$link');
  }
}
