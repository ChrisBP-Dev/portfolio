import 'package:portfolio/src/features/social_launcher/data/url_launcher_repository_imp.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'url_launcher_repository.g.dart';

abstract class UrlLauncherRepository {
  Future<void> launchLink(String link);
}

@riverpod
UrlLauncherRepository urlLauncherRepository(UrlLauncherRepositoryRef ref) {
  return UrlLauncherRepositoryImp();
}
