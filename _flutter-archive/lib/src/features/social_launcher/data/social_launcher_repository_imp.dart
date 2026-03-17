import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/constants/business_information.dart';
import 'package:portfolio/src/features/social_launcher/domain/social_launcher_repository.dart';
import 'package:portfolio/src/features/social_launcher/domain/url_launcher_repository.dart';

class SocialLauncherRepositoryImp extends SocialLauncherRepository {
  SocialLauncherRepositoryImp(this.ref);
  final Ref ref;

  @override
  Future<void> tiktokLauncher() async {
    await ref
        .read(urlLauncherRepositoryProvider)
        .launchLink(BusinessInformation.tiktokLink);
  }

  @override
  Future<void> linkedInLauncher() async {
    await ref
        .read(urlLauncherRepositoryProvider)
        .launchLink(BusinessInformation.linkedInLink);
  }

  @override
  Future<void> gitHubLauncher() async {
    await ref
        .read(urlLauncherRepositoryProvider)
        .launchLink(BusinessInformation.gitHubLink);
  }

  @override
  Future<void> launchAnyLink(String link) async {
    await ref.read(urlLauncherRepositoryProvider).launchLink(link);
  }
}
