import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/localization/string_hardcoded.dart';

enum FilterType {
  websiteUrl,
  sourceCodeUrl,
  all;
}

extension FilterTypeExtension on FilterType {
  String getValue(BuildContext context) {
    final l10n = context.l10n;
    return switch (this) {
      FilterType.websiteUrl => 'Website URL'.hardcoded,
      FilterType.sourceCodeUrl => 'Source Code URL',
      FilterType.all => l10n.allProjects,
    };
  }
}

class FilterDropdown extends StatelessWidget {
  const FilterDropdown({
    required this.filterType,
    required this.onSortChanged,
    super.key,
  });

  final FilterType filterType;
  final void Function(FilterType?) onSortChanged;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return ResponsiveCenter(
      padding: const EdgeInsets.symmetric(horizontal: Sizes.globalPadding),
      child: Row(
        children: [
          const Spacer(),
          DecoratedBox(
            decoration: BoxDecoration(
              border: Border.all(color: context.theme.dividerColor),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: Sizes.globalPadding,
                vertical: Sizes.p2,
              ),
              child: Row(
                children: [
                  Text('${l10n.filterBy}:'),
                  gapW20,
                  DropdownButton<FilterType>(
                    padding: const EdgeInsets.symmetric(horizontal: Sizes.p8),
                    focusColor: context.theme.scaffoldBackgroundColor,
                    underline: const SizedBox(),
                    value: filterType,
                    items: FilterType.values
                        .map(
                          (type) => DropdownMenuItem(
                            value: type,
                            child: Text(
                              type.getValue(context),
                            ),
                          ),
                        )
                        .toList(),
                    onChanged: onSortChanged,
                    dropdownColor: context.theme.cardColor,
                    style: context.bodyMedium,
                    iconEnabledColor: context.theme.iconTheme.color,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
