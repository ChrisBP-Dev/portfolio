import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/common_widgets/secondary_button.dart';
import 'package:portfolio/src/core/common_widgets/title_form_field.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/features/projects/presentation/admin/widgets/feature_card.dart';
import 'package:portfolio/src/features/projects/presentation/admin/widgets/project_form_field.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/localization/string_hardcoded.dart';

class FeaturesProjectList extends StatelessWidget {
  const FeaturesProjectList({
    required this.localeCode,
    required this.featuresList,
    required this.addTap,
    required this.removeTap,
    super.key,
  });

  final void Function(String) addTap;
  final void Function(String) removeTap;
  final String localeCode;
  final List<String> featuresList;

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        TitleFormField(title: '${l10n.featuresTitle} $localeCode'),
        DecoratedBox(
          decoration: BoxDecoration(
            border: Border.all(color: context.getPrimaryColor()),
          ),
          child: Column(
            children: [
              ...featuresList.map((feature) {
                return FeatureCard(
                  title: feature,
                  removeTap: () => removeTap.call(feature),
                );
              }),
            ],
          ),
        ),
        gapH14,
        Align(
          alignment: Alignment.centerRight,
          child: SecondaryButton(
            onTap: () => _showAddFeatureDialog(
              onSave: addTap,
              context: context,
            ),
            title: 'Add Feature',
          ),
        ),
        gapH14,
      ],
    );
  }

  Future<void> _showAddFeatureDialog({
    required void Function(String) onSave,
    required BuildContext context,
  }) async {
    final newFeature = await showDialog<String>(
      context: context,
      builder: (BuildContext context) {
        var featureText = '';
        return AlertDialog(
          title: Text('Add New Feature'.hardcoded),
          content: ResponsiveCenter(
            child: ProjectFormField(
              formType: ProjectFormType.features,
              onChanged: (value) => featureText = value,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Cancel'.hardcoded),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(featureText),
              child: Text('Save'.hardcoded),
            ),
          ],
        );
      },
    );

    if (newFeature == null || newFeature.isEmpty) return;
    onSave.call(newFeature);
  }
}
