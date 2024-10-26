import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/technology_icon.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/knowledge/domain/technology.dart';

class TechnologyIconText extends StatelessWidget {
  const TechnologyIconText({required this.technology, super.key, this.size});
  final Technology technology;
  final double? size;

  @override
  Widget build(BuildContext context) {
    final bodyLarge = Theme.of(context).textTheme.bodyLarge;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        TechnologyIcon(technology: technology),
        gapH14,
        Text(
          technology.name,
          style: bodyLarge,
        ),
      ],
    );
  }
}
