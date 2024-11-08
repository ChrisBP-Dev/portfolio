// lib/src/common_widgets/custom_text_form_field.dart
import 'package:flutter/material.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ProjectFormField extends StatelessWidget {
  const ProjectFormField({
    required this.formType,
    super.key,
    this.onChanged,
    this.maxLines,
    this.initialValue,
  });

  final void Function(String)? onChanged;

  final int? maxLines;
  final String? initialValue;
  final ProjectFormType formType;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return TextFormField(
      initialValue: initialValue,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      cursorErrorColor: theme.dividerColor,
      textCapitalization: TextCapitalization.sentences,
      decoration: InputDecoration(
        labelText: formType.getLabelText(context),
        labelStyle: theme.textTheme.bodySmall
            ?.copyWith(color: context.getPrimaryColor().withOpacity(.8)),
        border: defaultBorder(context.getPrimaryColor()),
        enabledBorder: defaultBorder(context.getPrimaryColor()),
        focusedErrorBorder: defaultBorder(context.getPrimaryColor()),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: context.getPrimaryColor()),
        ),
      ),
      onChanged: onChanged,
      validator: (value) {
        if (!formType.isRequired) return null;
        if (value != null && value.isNotEmpty) return null;
        return formType.getErrorText(context);
      },
      keyboardType: formType.getKeyboardType(),
      maxLines: maxLines,
      textAlignVertical: TextAlignVertical.top,
    );
  }

  OutlineInputBorder defaultBorder(Color color) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: color),
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

extension CustomTextFormFieldTypeX on ProjectFormType {
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
