import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/common_widgets/business_chip_text.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/experience/domain/experience.dart';
import 'package:portfolio/src/features/settings/presentation/locale_controller.dart';

class ExperienceCard extends ConsumerWidget {
  const ExperienceCard({
    required this.experience,
    super.key,
  });
  final Experience experience;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final color = theme.colorScheme.primary;
    final headlineSmall = theme.textTheme.headlineSmall;
    final bodyMedium = theme.textTheme.bodyMedium;
    final bodySmall = theme.textTheme.bodySmall;
    return AsyncValueWidget(
      value: ref.watch(localeControllerProvider),
      data: (locale) {
        final languageCode = locale.languageCode;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            gapH20,
            Row(
              children: [
                Text(experience.companyName, style: headlineSmall),
                const Spacer(),
                Text(
                  experience.date,
                  style: bodySmall?.copyWith(
                    color: color,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            BusinessChipText(text: experience.jobName(languageCode)),
            gapH20,
            ...experience.responsabilities(languageCode).map(
                  (responsability) => Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '-  ',
                        style:
                            bodyMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      Expanded(
                        child: Text(
                          responsability,
                          style: bodyMedium,
                          textAlign: TextAlign.left,
                        ),
                      ),
                    ],
                  ),
                ),
            gapH20,
            const Divider(),
          ],
        );
      },
    );
  }
}
