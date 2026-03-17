import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/features/experience/domain/experience_repository.dart';
import 'package:portfolio/src/features/home/presentation/components/experience/experience_card.dart';

class ExperiencesList extends ConsumerWidget {
  const ExperiencesList({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AsyncValueWidget(
      value: ref.watch(getExperiencesStreamProvider),
      data: (experiences) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: experiences
              .map(
                (experience) => ExperienceCard(experience: experience),
              )
              .toList(),
        );
      },
    );
  }
}
