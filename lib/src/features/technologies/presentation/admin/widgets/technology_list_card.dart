import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/technology_icon.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';

class TechnologyListCard extends StatelessWidget {
  const TechnologyListCard({required this.technology, super.key});
  final Technology technology;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border.all(
          color: context.getPrimaryColor(),
        ),
        borderRadius: BorderRadius.circular(Sizes.p8),
        color: context.theme.canvasColor,
      ),
      child: Padding(
        padding: const EdgeInsets.all(Sizes.p14),
        child: Row(
          children: [
            TechnologyIcon(technology: technology),
            gapW20,
            Text(technology.name),
            const Spacer(),
            Text(technology.experienceTime),
          ],
        ),
      ),
    );
  }
}
