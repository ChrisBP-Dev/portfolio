import 'package:flutter/material.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';

class BusinessChipText extends StatelessWidget {
  const BusinessChipText({required this.text, super.key});

  final String text;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(Sizes.p8),
        border: Border.all(
          color: context.theme.colorScheme.primary,
          width: .5,
        ),
        gradient: AppColor.textBusinessGradient,
      ),
      child: Padding(
        padding: const EdgeInsets.all(Sizes.p4),
        child: Text(
          text,
          style: context.bodySmall,
        ),
      ),
    );
  }
}
