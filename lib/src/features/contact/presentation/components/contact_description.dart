import 'package:flutter/material.dart';
import 'package:portfolio/src/common_widgets/responsive_center.dart';
import 'package:portfolio/src/constants/app_sizes.dart';
import 'package:portfolio/src/constants/breakpoints.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ContactDescription extends StatelessWidget {
  const ContactDescription({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final bodyLarge = theme.textTheme.bodyLarge;
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
            style: theme.textTheme.headlineMedium,
          ),
          gapH20,
          Text(
            l10n.contactDescription,
            style: bodyLarge,
          ),
          gapH14,
        ],
      ),
    );
  }
}
