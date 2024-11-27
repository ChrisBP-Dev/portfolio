// lib/src/common_widgets/custom_text_form_field.dart
import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/custom_text_form_field.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ProjectFormField extends StatelessWidget {
  const ProjectFormField({
    required this.formType,
    super.key,
    this.maxLines,
    this.controller,
  });

  final int? maxLines;
  final TextEditingController? controller;
  final ProjectFormType formType;

  @override
  Widget build(BuildContext context) {
    return CustomTextFormField(
      controller: controller,
      labelText: formType.getLabelText(context),
      validator: (value) {
        if (!formType.isRequired) return null;
        if (value != null && value.isNotEmpty) return null;
        return formType.getErrorText(context);
      },
      keyboardType: formType.getKeyboardType(),
      maxLines: maxLines,
    );
  }
}

enum ProjectFormType {
  companyName,
  shortDescription,
  features,
  websiteUrl,
  sourceCodeUrl,
}

extension ProjectFormFieldTypeX on ProjectFormType {
  String getLabelText(BuildContext context) {
    final l10n = context.l10n;
    return switch (this) {
      ProjectFormType.companyName => l10n.companyName,
      ProjectFormType.shortDescription => l10n.shortDescription,
      ProjectFormType.features => l10n.featuresTitle,
      ProjectFormType.websiteUrl => l10n.websiteTitle,
      ProjectFormType.sourceCodeUrl => l10n.sourceCodeTitle,
    };
  }

  String getErrorText(BuildContext context) {
    final l10n = context.l10n;
    return switch (this) {
      ProjectFormType.companyName => l10n.errorMessage(l10n.companyName),
      ProjectFormType.shortDescription =>
        l10n.errorMessage(l10n.shortDescription),
      ProjectFormType.features => l10n.errorMessage(l10n.featuresTitle),
      ProjectFormType.websiteUrl => l10n.errorMessage(l10n.websiteTitle),
      ProjectFormType.sourceCodeUrl => l10n.errorMessage(l10n.sourceCodeTitle),
    };
  }

  TextInputType getKeyboardType() {
    return switch (this) {
      ProjectFormType.companyName ||
      ProjectFormType.shortDescription ||
      ProjectFormType.features =>
        TextInputType.text,
      ProjectFormType.websiteUrl ||
      ProjectFormType.sourceCodeUrl =>
        TextInputType.url,
    };
  }

  bool get isRequired {
    return switch (this) {
      ProjectFormType.companyName ||
      ProjectFormType.shortDescription ||
      ProjectFormType.features =>
        true,
      ProjectFormType.websiteUrl || ProjectFormType.sourceCodeUrl => false,
    };
  }
}
