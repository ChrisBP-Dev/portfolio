import 'package:flutter/material.dart';
import 'package:portfolio/src/core/constants/experiences.dart';
import 'package:portfolio/src/features/home/presentation/components/experience/experience_card.dart';

class ExperiencesList extends StatelessWidget {
  const ExperiencesList({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: kExperiences
          .map(
            (experience) => ExperienceCard(experience: experience),
          )
          .toList(),
    );
  }
}
