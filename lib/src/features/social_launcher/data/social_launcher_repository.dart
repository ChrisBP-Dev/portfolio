import 'package:portfolio/src/core/constants/business_information.dart';
import 'package:portfolio/src/features/social_launcher/data/url_launcher_repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'social_launcher_repository.g.dart';

@riverpod
class SocialLauncherRepository extends _$SocialLauncherRepository {
  @override
  Future<void> build() async {
    // nothing to do for now.
  }

  Future<void> tiktokLauncher() async {
    await ref
        .read(urlLauncherRepositoryProvider)
        .launchLink(BusinessInformation.tiktokLink);
  }

  Future<void> linkedInLauncher() async {
    await ref
        .read(urlLauncherRepositoryProvider)
        .launchLink(BusinessInformation.linkedInLink);
  }

  Future<void> gitHubLauncher() async {
    await ref
        .read(urlLauncherRepositoryProvider)
        .launchLink(BusinessInformation.gitHubLink);
  }

  Future<void> launchAnyLink(String link) async {
    await ref.read(urlLauncherRepositoryProvider).launchLink(link);
  }
}
