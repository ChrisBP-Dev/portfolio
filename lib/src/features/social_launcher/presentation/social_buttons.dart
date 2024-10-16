import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:portfolio/src/common_widgets/social_button.dart';
import 'package:portfolio/src/constants/app_sizes.dart';
import 'package:portfolio/src/features/social_launcher/presentation/social_launcher_controller.dart';

class SocialButtons extends ConsumerWidget {
  const SocialButtons({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SocialButton(
          icon: FontAwesomeIcons.tiktok,
          onTap: () {
            // TODO(me): Implement TikTok launcher
          },
        ),
        gapW20,
        SocialButton(
          icon: FontAwesomeIcons.github,
          onTap: () {
            ref.read(socialLauncherControllerProvider.notifier).launchGitHub();
          },
        ),
        gapW20,
        SocialButton(
          icon: FontAwesomeIcons.linkedinIn,
          onTap: () {
            ref
                .read(socialLauncherControllerProvider.notifier)
                .launchLinkedIn();
          },
        ),
      ],
    );
  }
}
