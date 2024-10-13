import 'dart:developer';
import 'package:mailto/mailto.dart';
import 'package:portfolio/src/constants/business_information.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:whatsapp_unilink/whatsapp_unilink.dart';
part 'social_launcher_repository.g.dart';

class SocialLauncherRepository {
  Future<void> whatsAppLauncher() async {
    const link = WhatsAppUnilink(
      phoneNumber: BusinessInformation.phone,
      text: BusinessInformation.templateMessageFromWebsite,
    );
    await _customLauncher('$link');
  }

  Future<void> mailToLauncher() async {
    final link = Mailto(
      to: [BusinessInformation.email],
      cc: [],
      body: BusinessInformation.templateMessageFromWebsite,
    ).toString();
    await _customLauncher(link);
  }

  Future<void> linkedInLauncher() async {
    await _customLauncher(BusinessInformation.linkedInLink);
  }

  Future<void> gitHubLauncher() async {
    await _customLauncher(BusinessInformation.gitHubLink);
  }

  Future<void> launchAnyLink(String link) async {
    await _customLauncher(link);
  }

  Future<void> _customLauncher(String link) async {
    final url = Uri.parse(link);
    try {
      if (!(await canLaunchUrl(url))) return;
      final response = await launchUrl(url);
      if (!response) return;
      return;
    } catch (e) {
      log(link);
      return;
    }
  }
}

@riverpod
SocialLauncherRepository socialLauncherRepository(
  SocialLauncherRepositoryRef ref,
) =>
    SocialLauncherRepository();
