import 'package:flutter/material.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';
import 'package:portfolio/src/localization/l10n.dart';

class AboutDetails extends StatelessWidget {
  const AboutDetails({super.key});

  @override
  Widget build(BuildContext context) {
    return Text(
      context.l10n.aboutMeDescription,
      style: context.bodyLarge,
      textAlign: TextAlign.center,
    );
  }
}
