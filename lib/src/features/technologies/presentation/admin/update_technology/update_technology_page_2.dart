// import 'package:flutter/material.dart';
// import 'package:flutter_riverpod/flutter_riverpod.dart';
// import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
// import 'package:portfolio/src/core/common_widgets/title_form_field.dart';
// import 'package:portfolio/src/core/constants/app_sizes.dart';
// import 'package:portfolio/src/features/technologies/domain/technology.dart';
// import 'package:portfolio/src/features/technologies/presentation/admin/update_technology/admin_update_technology_form_controller.dart';
// import 'package:portfolio/src/features/technologies/presentation/admin/widgets/technology_form_field.dart';
// import 'package:portfolio/src/localization/l10n.dart';

// class AdminUpdateTechnologyPage extends ConsumerStatefulWidget {
//   const AdminUpdateTechnologyPage({required this.technology, super.key});
//   final Technology technology;

//   @override
//   ConsumerState<AdminUpdateTechnologyPage> createState() =>
//       _AdminUpdateTechnologyPageState();
// }

// class _AdminUpdateTechnologyPageState
//     extends ConsumerState<AdminUpdateTechnologyPage> {
//   final _formKey = GlobalKey<FormState>();
//   final TextEditingController _nameController ;

//   @override
//   void initState() {
//     WidgetsBinding.instance.addPostFrameCallback((_) {
//       ref
//           .read(adminUpdateTechnologyFormControllerProvider.notifier)
//           .initTechnology(widget.technology);
//     });
//     super.initState();
//   }

//   @override
//   Widget build(BuildContext context) {
//     final l10n = context.l10n;

//     return AlertDialog(
//       shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
//       title: Text(l10n.update(l10n.technology)),
//       scrollable: true,
//       actionsAlignment: MainAxisAlignment.center,
//       actionsOverflowButtonSpacing: 15,
//       content: ResponsiveCenter(
//         child: Form(
//           key: _formKey,
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.stretch,
//             children: [
//               TitleFormField(title: l10n.mainImageTitle),
//               gapH14,
//               // const UpdateImageTechnology(),
//               gapH14,
//               TitleFormField(title: l10n.nameLabel),
//               TechnologyFormField(
//                 initialValue:
//                     ref.watch(adminUpdateTechnologyFormControllerProvider).name,
//                 formType: TechnologyFormType.name,
//                 onChanged: (newValue) {
//                   ref
//                       .read(
//                         adminUpdateTechnologyFormControllerProvider.notifier,
//                       )
//                       .setName(newValue);
//                 },
//               ),
//               gapH14,
//               TitleFormField(title: l10n.experienceTime),
//               TechnologyFormField(
//                 initialValue: ref
//                     .watch(adminUpdateTechnologyFormControllerProvider)
//                     .experienceTime,
//                 formType: TechnologyFormType.experienceTime,
//                 onChanged: (newValue) {
//                   ref
//                       .read(
//                         adminUpdateTechnologyFormControllerProvider.notifier,
//                       )
//                       .setExperienceTime(newValue);
//                 },
//               ),
//               gapH20,
//             ],
//           ),
//         ),
//       ),
//       actions: const [
//         // CreateTechnologyButton(formKey: _formKey),
//       ],
//     );
//   }
// }
