import 'package:flutter/material.dart';
import 'package:portfolio/src/localization/l10n.dart';

class AboutDetails extends StatelessWidget {
  const AboutDetails({super.key});

  @override
  Widget build(BuildContext context) {
    final bodyLarge = Theme.of(context).textTheme.bodyLarge;

    return Text(
      context.l10n.aboutMeDescription,
      style: bodyLarge,
      textAlign: TextAlign.center,
    );
  }
}
