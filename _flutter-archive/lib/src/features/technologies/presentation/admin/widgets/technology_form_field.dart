// lib/src/common_widgets/custom_text_form_field.dart
import 'package:flutter/material.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';
import 'package:portfolio/src/localization/l10n.dart';

class TechnologyFormField extends StatelessWidget {
  const TechnologyFormField({
    required this.formType,
    super.key,
    this.controller,
  });

  final TextEditingController? controller;
  final TechnologyFormType formType;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      cursorErrorColor: context.theme.dividerColor,
      textCapitalization: TextCapitalization.sentences,
      decoration: InputDecoration(
        labelText: formType.getLabelText(context),
        labelStyle: context.bodySmall
            ?.copyWith(color: context.getPrimaryColor().withValues(alpha: .8)),
        border: defaultBorder(context.getPrimaryColor()),
        enabledBorder: defaultBorder(context.getPrimaryColor()),
        focusedErrorBorder: defaultBorder(context.getPrimaryColor()),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: context.getPrimaryColor()),
        ),
      ),
      validator: (value) {
        if (value != null && value.isNotEmpty) return null;
        return formType.getErrorText(context);
      },
      keyboardType: formType.getKeyboardType(),
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

enum TechnologyFormType {
  name,
  experienceTime,
}

extension CustomTextFormFieldTypeX on TechnologyFormType {
  String getLabelText(BuildContext context) {
    final l10n = context.l10n;
    return switch (this) {
      TechnologyFormType.name => l10n.nameLabel,
      TechnologyFormType.experienceTime => l10n.experienceTime,
    };
  }

  String getErrorText(BuildContext context) {
    final l10n = context.l10n;
    return switch (this) {
      TechnologyFormType.name => l10n.errorMessage(l10n.nameLabel),
      TechnologyFormType.experienceTime =>
        l10n.errorMessage(l10n.experienceTime),
    };
  }

  TextInputType getKeyboardType() {
    return switch (this) {
      TechnologyFormType.name => TextInputType.text,
      TechnologyFormType.experienceTime =>
        const TextInputType.numberWithOptions(decimal: true),
    };
  }
}
