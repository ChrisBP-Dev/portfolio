import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/features/technologies/domain/admin_technology_repository.dart';

class TechnologiesChecklists extends ConsumerWidget {
  const TechnologiesChecklists({
    required this.isSelected,
    required this.onChanged,
    super.key,
  });

  final bool Function(String) isSelected;
  // ignore: avoid_positional_boolean_parameters
  final void Function(bool isSelected, String id) onChanged;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border.all(
          color: context.getPrimaryColor(),
          width: 2,
        ),
        borderRadius: BorderRadius.circular(Sizes.p4),
      ),
      child: SizedBox(
        width: double.infinity,
        child: Padding(
          padding: const EdgeInsets.symmetric(
            vertical: Sizes.globalPadding,
          ),
          child: AsyncValueWidget(
            value: ref.watch(getAdminTechnologiesProvider),
            data: (technologies) {
              return Wrap(
                children: technologies.map(
                  (technology) {
                    return Container(
                      width: 240,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(Sizes.p4),
                        border: Border.all(
                          color: context.getPrimaryColor(),
                        ),
                      ),
                      margin: const EdgeInsets.all(Sizes.p8),
                      child: CheckboxListTile.adaptive(
                        contentPadding: const EdgeInsets.only(
                          left: Sizes.p8,
                        ),
                        value: isSelected.call(technology.id),
                        onChanged: (value) {
                          if (value == null) return;
                          onChanged.call(
                            value,
                            technology.id,
                          );
                        },
                        selected: isSelected.call(technology.id),
                        title: Text(technology.name),
                      ),
                    );
                  },
                ).toList(),
              );
            },
          ),
        ),
      ),
    );
  }
}
