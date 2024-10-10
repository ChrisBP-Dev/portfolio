import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/common_widgets/primary_button.dart';
import 'package:portfolio/src/common_widgets/secondary_button.dart';
import 'package:portfolio/src/constants/app_sizes.dart';
import 'package:portfolio/src/features/social_launcher/presentation/social_launcher_controller.dart';
import 'package:portfolio/src/localization/l10n.dart';

class AboutButtons extends ConsumerWidget {
  const AboutButtons({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Wrap(
      alignment: WrapAlignment.center,
      runSpacing: Sizes.globalPadding,
      spacing: Sizes.globalPadding,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        PrimaryButton(
          text: context.l10n.getInTouch,
          onTap: ref
              .read(socialLauncherControllerProvider.notifier)
              .launchWhatsApp,
        ),
        SecondaryButton(
          title: context.l10n.downloadCV,
          onTap: () {
            // TODO(me): implement download cv
          },
        ),
      ],
    );
  }
}
