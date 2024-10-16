import 'package:mailto/mailto.dart';
import 'package:portfolio/src/constants/business_information.dart';
import 'package:portfolio/src/features/contact/domain/contact_message.dart';
import 'package:portfolio/src/features/social_launcher/data/url_launcher_repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:whatsapp_unilink/whatsapp_unilink.dart';
part 'contact_repository.g.dart';

@riverpod
class ContactRepository extends _$ContactRepository {
  @override
  Future<void> build() async {
    // nothing to do for now.
  }

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
