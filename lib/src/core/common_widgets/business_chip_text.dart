import 'package:flutter/material.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';

class BusinessChipText extends StatelessWidget {
  const BusinessChipText({required this.text, super.key});

  final String text;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final color = theme.colorScheme.primary;
    final bodySmall = theme.textTheme.bodySmall;
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(Sizes.p8),
        border: Border.all(
          color: color,
          width: .5,
        ),
        gradient: AppColor.textBusinessGradient,
      ),
      child: Padding(
        padding: const EdgeInsets.all(Sizes.p4),
        child: Text(
          text,
          style: bodySmall,
        ),
      ),
    );
  }
}
