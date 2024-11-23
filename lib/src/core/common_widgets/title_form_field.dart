import 'package:flutter/material.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';

class TitleFormField extends StatelessWidget {
  const TitleFormField({required this.title, super.key});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: Sizes.p8),
      child: Text(
        title,
        style: context.bodySmall?.copyWith(
          color: context.getPrimaryColor(),
        ),
      ),
    );
  }
}
