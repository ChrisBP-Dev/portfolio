import 'package:flutter/material.dart';
import 'package:portfolio/src/constants/app_sizes.dart';

class TitleFormField extends StatelessWidget {
  const TitleFormField({required this.title, super.key});

  final String title;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: Sizes.p8),
      child: Text(
        title,
        style: theme.textTheme.bodySmall?.copyWith(color: theme.dividerColor),
      ),
    );
  }
}
