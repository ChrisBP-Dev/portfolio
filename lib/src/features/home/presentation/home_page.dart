import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/wrapper_scroll.dart';
import 'package:portfolio/src/features/home/presentation/components/about_me/about_me_component.dart';
import 'package:portfolio/src/features/home/presentation/components/experience/experience_component.dart';
import 'package:portfolio/src/features/home/presentation/components/projects/projects_component.dart';
import 'package:portfolio/src/features/home/presentation/components/technologies/technologies_component.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const WrapperScroll(
      key: PageStorageKey('homePage'),
      components: [
        AboutMeComponent(),
        TechnologiesComponent(),
        ProjectsComponent(),
        ExperienceComponent(),
      ],
    );
  }
}
