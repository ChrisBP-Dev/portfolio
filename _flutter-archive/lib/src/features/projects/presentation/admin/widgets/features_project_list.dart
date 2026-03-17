import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/custom_text_form_field.dart';
import 'package:portfolio/src/core/common_widgets/title_form_field.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/features/projects/presentation/admin/widgets/feature_card.dart';
import 'package:portfolio/src/localization/l10n.dart';

class FeaturesProjectList extends StatefulWidget {
  const FeaturesProjectList({
    required this.onFeaturesChanged,
    required this.localeCode,
    this.initialFeatures,
    super.key,
  });

  final String localeCode;
  final void Function(List<String>) onFeaturesChanged;
  final List<String>? initialFeatures;

  @override
  State<FeaturesProjectList> createState() => _FeaturesProjectListState();
}

class _FeaturesProjectListState extends State<FeaturesProjectList> {
  late List<String> _featuresList;
  final TextEditingController _controller = TextEditingController();
  int? _editingIndex;

  @override
  void initState() {
    _featuresList = List<String>.from(widget.initialFeatures ?? []);
    super.initState();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _addFeature() {
    if (_controller.text.isNotEmpty) {
      setState(() {
        _featuresList.add(_controller.text);
        _controller.clear();
        widget.onFeaturesChanged(_featuresList);
      });
    }
  }

  void _updateFeature() {
    if (_controller.text.isNotEmpty && _editingIndex != null) {
      setState(() {
        _featuresList[_editingIndex!] = _controller.text;
        _controller.clear();
        _editingIndex = null;
        widget.onFeaturesChanged(_featuresList);
      });
    }
  }

  void _editFeature(int index) {
    setState(() {
      _controller.text = _featuresList[index];
      _editingIndex = index;
    });
  }

  void _removeFeature(String feature) {
    setState(() {
      _featuresList.remove(feature);
      widget.onFeaturesChanged(_featuresList);
    });
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        TitleFormField(title: '${l10n.featuresTitle} ${widget.localeCode}'),
        DecoratedBox(
          decoration: BoxDecoration(
            border: Border.all(color: context.getPrimaryColor()),
          ),
          child: Column(
            children: [
              ...List.generate(_featuresList.length, (index) {
                final feature = _featuresList[index];
                if (_editingIndex == index) {
                  return Padding(
                    padding: const EdgeInsets.all(Sizes.p8),
                    child: Row(
                      children: [
                        Expanded(
                          child: CustomTextFormField(
                            controller: _controller,
                            labelText: l10n.featuresTitle,
                            onFieldSubmitted: (_) => _updateFeature(),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.update),
                          onPressed: _updateFeature,
                        ),
                      ],
                    ),
                  );
                } else {
                  return FeatureCard(
                    title: feature,
                    editTap: () => _editFeature(index),
                    removeTap: () => _removeFeature(feature),
                  );
                }
              }),
            ],
          ),
        ),
        if (_editingIndex == null) ...[
          gapH14,
          Row(
            children: [
              Expanded(
                child: CustomTextFormField(
                  controller: _controller,
                  labelText: l10n.featuresTitle,
                  onFieldSubmitted: (_) => _addFeature(),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add),
                onPressed: _addFeature,
              ),
            ],
          ),
        ],
      ],
    );
  }
}
