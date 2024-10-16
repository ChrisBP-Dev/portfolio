import 'dart:developer';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:url_launcher/url_launcher.dart';
part 'url_launcher_repository.g.dart';

class UrlLauncherRepository {
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

@riverpod
UrlLauncherRepository urlLauncherRepository(UrlLauncherRepositoryRef ref) =>
    UrlLauncherRepository();
