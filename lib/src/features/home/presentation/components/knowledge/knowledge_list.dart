import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/breakpoints.dart';
import 'package:portfolio/src/core/constants/knowledge.dart';
import 'package:portfolio/src/features/home/presentation/components/knowledge/knowledge_icon.dart';

class KnowledgeList extends StatelessWidget {
  const KnowledgeList({super.key});

  @override
  Widget build(BuildContext context) {
    return ResponsiveCenter(
      maxContentWidth: Breakpoint.mobile,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: kKnowledge.tecnologies
            .map((tecnology) => KnowledgeIcon(urlSvg: tecnology.imageUrl))
            .toList(),
      ),
    );
  }
}
