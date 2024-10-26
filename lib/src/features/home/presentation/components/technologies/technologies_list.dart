import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/breakpoints.dart';
import 'package:portfolio/src/features/home/presentation/components/technologies/technology_icon_text.dart';
import 'package:portfolio/src/features/knowledge/domain/knowledge_repository.dart';

class TechnologiesList extends ConsumerWidget {
  const TechnologiesList({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ResponsiveCenter(
      maxContentWidth: Breakpoint.mobile,
      child: AsyncValueWidget(
        value: ref.watch(getKnowledgeProvider),
        data: (knowledge) {
          return Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: knowledge.tecnologies.map(
              (tecnology) {
                return TechnologyIconText(technology: tecnology);
              },
            ).toList(),
          );
        },
      ),
    );
  }
}
