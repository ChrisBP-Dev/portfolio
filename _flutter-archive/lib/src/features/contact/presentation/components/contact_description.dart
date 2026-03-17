import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/constants/breakpoints.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ContactDescription extends StatelessWidget {
  const ContactDescription({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return ResponsiveCenter(
      padding: const EdgeInsets.all(Sizes.globalPadding),
      maxContentWidth: Breakpoint.tablet,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          gapH20,
          Text(
            l10n.contactTitle,
            style: context.headlineMedium,
          ),
          gapH20,
          Text(
            l10n.contactDescription,
            style: context.bodyLarge,
          ),
          gapH14,
        ],
      ),
    );
  }
}
