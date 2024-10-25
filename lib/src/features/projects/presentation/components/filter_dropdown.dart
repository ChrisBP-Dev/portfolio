import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/localization/l10n.dart';

enum FilterType {
  websiteUrl,
  sourceCodeUrl,
  all;
}

extension FilterTypeExtension on FilterType {
  String getValue(BuildContext context) {
    final l10n = context.l10n;
    return switch (this) {
      FilterType.websiteUrl => 'Website URL',
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
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: Sizes.globalPadding,
              vertical: Sizes.p2,
            ),
            decoration: BoxDecoration(
              border: Border.all(color: Theme.of(context).dividerColor),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Row(
              children: [
                Text('${l10n.filterBy}:'),
                gapW20,
                DropdownButton<FilterType>(
                  padding: const EdgeInsets.symmetric(horizontal: Sizes.p8),
                  focusColor: Theme.of(context).scaffoldBackgroundColor,
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
                  dropdownColor: Theme.of(context).cardColor,
                  style: Theme.of(context).textTheme.bodyMedium,
                  iconEnabledColor: Theme.of(context).iconTheme.color,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
