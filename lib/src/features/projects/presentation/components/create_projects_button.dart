import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/common_widgets/primary_button.dart';
import 'package:portfolio/src/common_widgets/responsive_center.dart';
import 'package:portfolio/src/features/projects/presentation/projects_controller.dart';

// TODO(me): Check this and remove it if not needed
class CreateProjectsButton extends ConsumerWidget {
  const CreateProjectsButton({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ResponsiveCenter(
      child: AsyncValueWidget(
        value: ref.watch(projectsControllerProvider),
        data: (data) {
          return PrimaryButton(
            onTap: () {
              ref.read(projectsControllerProvider.notifier).createProjecs();
            },
            text: 'Create Projects',
          );
        },
      ),
    );
  }
}
