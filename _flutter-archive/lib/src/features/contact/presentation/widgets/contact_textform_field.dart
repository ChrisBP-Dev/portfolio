import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/custom_text_form_field.dart';
import 'package:portfolio/src/localization/l10n.dart';

class ContactTextformField extends StatelessWidget {
  const ContactTextformField({
    required this.formType,
    super.key,
    this.controller,
    this.maxLines,
  });

  final TextEditingController? controller;
  final int? maxLines;
  final ContactFormType formType;

  @override
  Widget build(BuildContext context) {
    return CustomTextFormField(
      controller: controller,
      labelText: formType.getLabelText(context),
      validator: (value) {
        if (value != null && value.isNotEmpty) return null;
        return formType.getErrorText(context);
      },
      keyboardType: formType.getKeyboardType(),
      maxLines: maxLines,
    );
  }
}

enum ContactFormType {
  name,
  email,
  message,
  phoneNumber,
}

extension CustomTextFormFieldTypeX on ContactFormType {
  String getLabelText(BuildContext context) {
    final l10n = context.l10n;
    return switch (this) {
      ContactFormType.name => l10n.nameLabel,
      ContactFormType.email => l10n.emailLabel,
      ContactFormType.message => l10n.messageLabel,
      ContactFormType.phoneNumber => l10n.phoneNumberLabel,
    };
  }

  String getErrorText(BuildContext context) {
    final l10n = context.l10n;
    return switch (this) {
      ContactFormType.name => l10n.errorMessage(l10n.nameLabel),
      ContactFormType.email => l10n.errorMessage(l10n.emailLabel),
      ContactFormType.message => l10n.errorMessage(l10n.messageLabel),
      ContactFormType.phoneNumber => l10n.errorMessage(l10n.phoneNumberLabel),
    };
  }

  TextInputType getKeyboardType() {
    return switch (this) {
      ContactFormType.name || ContactFormType.message => TextInputType.text,
      ContactFormType.email => TextInputType.emailAddress,
      ContactFormType.phoneNumber => TextInputType.phone,
    };
  }
}
