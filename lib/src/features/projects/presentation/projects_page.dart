import 'package:flutter/material.dart';
import 'package:portfolio/src/common_widgets/wrapper_scroll.dart';

class ProjectsPage extends StatelessWidget {
  const ProjectsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const WrapperScroll(
      key: PageStorageKey('ProjectPage'),
      components: [],
    );
  }
}
