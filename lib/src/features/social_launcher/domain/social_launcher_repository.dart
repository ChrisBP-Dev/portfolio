import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/features/social_launcher/data/social_launcher_repository_imp.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'social_launcher_repository.g.dart';

abstract class SocialLauncherRepository {
  Future<void> tiktokLauncher();
  Future<void> linkedInLauncher();
  Future<void> gitHubLauncher();
  Future<void> launchAnyLink(String link);
}

@riverpod
SocialLauncherRepository socialLauncherRepository(Ref ref) {
  return SocialLauncherRepositoryImp(ref);
}
