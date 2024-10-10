import 'package:portfolio/src/features/social_launcher/data/social_launcher_repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'social_launcher_controller.g.dart';

@riverpod
class SocialLauncherController extends _$SocialLauncherController {
  @override
  FutureOr<void> build() {
    // nothing to do for now
  }

  Future<void> launchWhatsApp() async {
    final launcher = ref.read(socialLauncherRepositoryProvider);
    return _launch(launcher.whatsAppLauncher);
  }

  Future<void> launchMailTo() async {
    final launcher = ref.read(socialLauncherRepositoryProvider);
    return _launch(launcher.mailToLauncher);
  }

  Future<void> launchGitHub() async {
    final launcher = ref.read(socialLauncherRepositoryProvider);
    return _launch(launcher.gitHubLauncher);
  }

  Future<void> launchLinkedIn() async {
    final launcher = ref.read(socialLauncherRepositoryProvider);
    return _launch(launcher.linkedInLauncher);
  }

  Future<void> _launch(Future<void> Function() launcher) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(launcher);
  }
}
