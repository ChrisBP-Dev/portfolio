import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/common_widgets/primary_button.dart';
import 'package:portfolio/src/common_widgets/secondary_button.dart';
import 'package:portfolio/src/constants/app_sizes.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/routing/app_route.dart';

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
          onTap: () => context.goNamed(AppRoute.contact.name),
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
