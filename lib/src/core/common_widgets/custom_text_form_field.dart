// lib/src/common_widgets/custom_text_form_field.dart
import 'package:flutter/material.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/localization/l10n.dart';

class CustomTextFormField extends StatelessWidget {
  const CustomTextFormField({
    required this.formType,
    super.key,
    this.onSaved,
    this.maxLines,
  });

  final FormFieldSetter<String>? onSaved;

  final int? maxLines;
  final FormType formType;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return TextFormField(
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
      onSaved: onSaved,
      validator: (value) {
        if (value != null && value.isNotEmpty) return null;
        return formType.getErrorText(context);
      },
      keyboardType: formType.getKeyboardType(),
      maxLines: maxLines ?? 1,
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

enum FormType {
  name,
  email,
  message,
  phoneNumber,
}

extension CustomTextFormFieldTypeX on FormType {
  String getLabelText(BuildContext context) {
    final l10n = context.l10n;
    return switch (this) {
      FormType.name => l10n.nameLabel,
      FormType.email => l10n.emailLabel,
      FormType.message => l10n.messageLabel,
      FormType.phoneNumber => l10n.phoneNumberLabel,
    };
  }

  String getErrorText(BuildContext context) {
    final l10n = context.l10n;
    return switch (this) {
      FormType.name => l10n.errorMessage(l10n.nameLabel),
      FormType.email => l10n.errorMessage(l10n.emailLabel),
      FormType.message => l10n.errorMessage(l10n.messageLabel),
      FormType.phoneNumber => l10n.errorMessage(l10n.phoneNumberLabel),
    };
  }

  TextInputType getKeyboardType() {
    return switch (this) {
      FormType.name || FormType.message => TextInputType.text,
      FormType.email => TextInputType.emailAddress,
      FormType.phoneNumber => TextInputType.phone,
    };
  }
}
