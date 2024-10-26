import 'dart:developer';
import 'package:portfolio/src/features/social_launcher/domain/url_launcher_repository.dart';
import 'package:url_launcher/url_launcher.dart';

class UrlLauncherRepositoryImp implements UrlLauncherRepository {
  @override
  Future<void> launchLink(String link) async {
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
